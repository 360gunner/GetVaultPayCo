"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import Image from "next/image";
import { submitKYC, getKYCStatus } from "@/lib/vaultpay-api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function KYCVerificationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const isUSA = selectedCountry === "US";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [kycData, setKycData] = useState({
    idType: " passport",
    identificationNumber: "",
    idDocument: null as File | null,
    selfieImage: null as File | null,
  });

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'idDocument' | 'selfieImage' | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedIdImage, setCapturedIdImage] = useState<string | null>(null);
  const [capturedSelfieImage, setCapturedSelfieImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const closeCameraModal = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraModalOpen(false);
    setCameraTarget(null);
    setCameraReady(false);
  }, []);

  // Start camera
  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'environment') => {
    setError('');
    
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // First try with the specified facing mode
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          }
        });
      } catch {
        // If that fails, try with just video: true
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraReady(false);
        setError('');

        try {
          await videoRef.current.play();
        } catch {
          // Ignore; some browsers will autoplay once metadata is loaded.
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device. Please connect a camera or use a device with a camera.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close other apps using the camera and try again.');
      } else if (err.name === 'OverconstrainedError') {
        setError('Camera does not meet the requirements. Please try with a different camera.');
      } else {
        setError('Unable to access camera. Please check your browser settings and ensure camera permissions are granted.');
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    closeCameraModal();
  }, [closeCameraModal]);

  // Capture image from camera
  const captureImage = useCallback((type: 'idDocument' | 'selfieImage') => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera is not ready yet. Please wait a moment and try again.');
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Convert data URL to File
    fetch(imageDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${type}_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setKycData(prev => ({ ...prev, [type]: file }));
        
        if (type === 'idDocument') {
          setCapturedIdImage(imageDataUrl);
        } else {
          setCapturedSelfieImage(imageDataUrl);
        }

        closeCameraModal();
      });
  }, [closeCameraModal]);

  // Cleanup camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    stopCamera();
  }, [currentStep, stopCamera]);

  const openCameraModal = useCallback((target: 'idDocument' | 'selfieImage', facingMode: 'user' | 'environment') => {
    setCameraTarget(target);
    setCameraFacingMode(facingMode);
    setCameraModalOpen(true);
    setCameraReady(false);
  }, []);

  useEffect(() => {
    if (!cameraModalOpen || !cameraTarget) return;
    startCamera(cameraFacingMode);
  }, [cameraFacingMode, cameraModalOpen, cameraTarget, startCamera]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    const country = localStorage.getItem("signupCountry") || "";
    setSelectedCountry(country);
    checkExistingKYC();
  }, [isAuthenticated, router]);

  const checkExistingKYC = async () => {
    if (!user) return;
    try {
      const response = await getKYCStatus(user.user_id, user.login_code);
      if (response.status && response.data.is_kyc_verified === 2) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking KYC status:", error);
    }
  };

  const handleFileChange = (field: 'idDocument' | 'selfieImage', file: File | null) => {
    setKycData({ ...kycData, [field]: file });
    setError("");
  };

  const handleSubmitKYC = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    if (!kycData.identificationNumber || !kycData.idDocument || !kycData.selfieImage) {
      setError("Please complete all required fields and upload all documents");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await submitKYC({
        userId: user.user_id,
        loginCode: user.login_code,
        id_type: kycData.idType,
        Identification_number: kycData.identificationNumber,
        identification_document: kycData.idDocument,
        face_verification_image: kycData.selfieImage,
      });

      if (response.status) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setError(response.message || "KYC submission failed. Please try again.");
      }
    } catch (err) {
      console.error("KYC submission error:", err);
      setError("An error occurred during submission. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(24), color: vars.color.vaultBlack }}>
              Step 1: Identification Number
            </Typography>
            <div style={{ marginBottom: fluidUnit(24) }}>
              <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>ID Type</label>
              <select
                value={kycData.idType}
                onChange={(e) => setKycData({ ...kycData, idType: e.target.value })}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: vars.color.vaultWhite,
                }}
              >
                <option value=" passport">Passport</option>
                <option value="id">National ID / Driver's License</option>
              </select>
            </div>
            <div style={{ marginBottom: fluidUnit(24) }}>
              <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Identification Number</label>
              <input
                type="text"
                value={kycData.identificationNumber}
                onChange={(e) => setKycData({ ...kycData, identificationNumber: e.target.value })}
                placeholder="Enter your ID number"
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: vars.color.vaultWhite,
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(24), color: vars.color.vaultBlack }}>
              Step 2: Capture ID Document
            </Typography>
            <div style={{
              padding: fluidUnit(32),
              border: `3px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(16),
              textAlign: "center",
              background: vars.color.vaultWhite,
              overflow: "hidden",
            }}>
              {!capturedIdImage && (
                <>
                  <div style={{
                    width: fluidUnit(80),
                    height: fluidUnit(80),
                    margin: "0 auto",
                    marginBottom: fluidUnit(16),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: vars.color.vpGreen,
                    borderRadius: "50%",
                  }}>
                    <span style={{ fontSize: fluidUnit(40) }}>📷</span>
                  </div>
                  <Typography as="p" style={{ fontSize: fluidUnit(16), marginBottom: fluidUnit(16), color: "#333" }}>
                    Take a clear photo of your {kycData.idType.replace('_', ' ')}
                  </Typography>
                  <Typography as="p" style={{ fontSize: fluidUnit(13), marginBottom: fluidUnit(24), color: "#666" }}>
                    Make sure all details are visible and the image is not blurry
                  </Typography>
                  <button
                    type="button"
                    onClick={() => openCameraModal('idDocument', 'environment')}
                    style={{
                      padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                      background: vars.color.vaultBlack,
                      color: vars.color.vaultWhite,
                      border: "none",
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(16),
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: fluidUnit(8),
                    }}
                  >
                    📷 Take Photo
                  </button>
                </>
              )}

              {capturedIdImage && !cameraActive && (
                <div>
                  <img
                    src={capturedIdImage}
                    alt="Captured ID"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: fluidUnit(12),
                      marginBottom: fluidUnit(16),
                    }}
                  />
                  <Typography as="p" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint, fontWeight: 600, marginBottom: fluidUnit(12) }}>
                    ✓ ID Document captured
                  </Typography>
                  <button
                    onClick={() => {
                      setCapturedIdImage(null);
                      setKycData(prev => ({ ...prev, idDocument: null }));
                    }}
                    style={{
                      padding: `${fluidUnit(10)} ${fluidUnit(20)}`,
                      background: "transparent",
                      color: vars.color.vaultBlack,
                      border: `2px solid ${vars.color.vaultBlack}`,
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(14),
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(24), color: vars.color.vaultBlack }}>
              Step 3: Take a Selfie
            </Typography>
            <div style={{
              padding: fluidUnit(32),
              border: `3px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(16),
              textAlign: "center",
              background: vars.color.vaultWhite,
              overflow: "hidden",
            }}>
              {!capturedSelfieImage && (
                <>
                  <div style={{
                    width: fluidUnit(80),
                    height: fluidUnit(80),
                    margin: "0 auto",
                    marginBottom: fluidUnit(16),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: vars.color.vpGreen,
                    borderRadius: "50%",
                  }}>
                    <span style={{ fontSize: fluidUnit(40) }}>🤳</span>
                  </div>
                  <Typography as="p" style={{ fontSize: fluidUnit(16), marginBottom: fluidUnit(16), color: "#333" }}>
                    Take a clear selfie for identity verification
                  </Typography>
                  <Typography as="p" style={{ fontSize: fluidUnit(13), marginBottom: fluidUnit(24), color: "#666" }}>
                    Position your face in the center and ensure good lighting
                  </Typography>
                  <button
                    type="button"
                    onClick={() => openCameraModal('selfieImage', 'user')}
                    style={{
                      padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                      background: vars.color.vaultBlack,
                      color: vars.color.vaultWhite,
                      border: "none",
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(16),
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: fluidUnit(8),
                    }}
                  >
                    🤳 Take Selfie
                  </button>
                </>
              )}

              {capturedSelfieImage && !cameraActive && (
                <div>
                  <img
                    src={capturedSelfieImage}
                    alt="Captured Selfie"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: fluidUnit(12),
                      marginBottom: fluidUnit(16),
                    }}
                  />
                  <Typography as="p" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint, fontWeight: 600, marginBottom: fluidUnit(12) }}>
                    ✓ Selfie captured
                  </Typography>
                  <button
                    onClick={() => {
                      setCapturedSelfieImage(null);
                      setKycData(prev => ({ ...prev, selfieImage: null }));
                    }}
                    style={{
                      padding: `${fluidUnit(10)} ${fluidUnit(20)}`,
                      background: "transparent",
                      color: vars.color.vaultBlack,
                      border: `2px solid ${vars.color.vaultBlack}`,
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(14),
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div style={{ background: vars.color.vpGreen, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 600, padding: fluidUnit(32) }}>
          <div style={{
            width: fluidUnit(120),
            height: fluidUnit(120),
            background: vars.color.vaultWhite,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            marginBottom: fluidUnit(32),
            border: `4px solid ${vars.color.vaultBlack}`,
          }}>
            <span style={{ fontSize: fluidUnit(60), color: vars.color.neonMint }}>✓</span>
          </div>
          <Typography as="h1" style={{ fontSize: fluidUnit(48), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
            KYC Submitted!
          </Typography>
          <Typography as="p" style={{ fontSize: fluidUnit(20), color: vars.color.vaultBlack }}>
            Your documents are being reviewed. You'll be notified once verification is complete.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: vars.color.vpGreen, 
      minHeight: "100vh",
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    }}>
      <Navbar />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {cameraModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: fluidUnit(16),
        }}>
          <div style={{
            width: 'min(520px, 92vw)',
            background: vars.color.vaultWhite,
            borderRadius: fluidUnit(16),
            border: `3px solid ${vars.color.vaultBlack}`,
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: fluidUnit(16),
              borderBottom: `2px solid ${vars.color.vaultBlack}`,
              background: vars.color.vaultWhite,
            }}>
              <Typography as="p" style={{ fontSize: fluidUnit(16), fontWeight: 700, color: vars.color.vaultBlack }}>
                {cameraTarget === 'selfieImage' ? 'Take Selfie' : 'Capture ID Document'}
              </Typography>
              <button
                type="button"
                onClick={closeCameraModal}
                style={{
                  width: fluidUnit(36),
                  height: fluidUnit(36),
                  borderRadius: '50%',
                  border: `2px solid ${vars.color.vaultBlack}`,
                  background: 'transparent',
                  color: vars.color.vaultBlack,
                  fontSize: fluidUnit(18),
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: fluidUnit(16) }}>
              <div style={{
                width: '100%',
                background: '#000',
                borderRadius: fluidUnit(12),
                overflow: 'hidden',
                marginBottom: fluidUnit(16),
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => setCameraReady(true)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    maxHeight: '70vh',
                    transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : undefined,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: fluidUnit(12), justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={closeCameraModal}
                  style={{
                    padding: `${fluidUnit(12)} ${fluidUnit(24)}`,
                    background: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(14),
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!cameraActive || !cameraTarget || !cameraReady}
                  onClick={() => {
                    if (cameraTarget) captureImage(cameraTarget);
                  }}
                  style={{
                    padding: `${fluidUnit(12)} ${fluidUnit(24)}`,
                    background: vars.color.neonMint,
                    color: vars.color.vaultBlack,
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(14),
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: (!cameraActive || !cameraTarget || !cameraReady) ? 0.6 : 1,
                  }}
                >
                  📸 Capture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main style={{ 
        minHeight: "calc(100vh - 80px)", 
        display: "flex", 
        alignItems: "center", 
        padding: `${fluidUnit(100)} ${fluidUnit(40)} ${fluidUnit(40)}` 
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: 1200, 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: fluidUnit(60),
          alignItems: "center",
        }}>
          
          {/* Left Side - Phone Mockup */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 350,
            }}>
              {/* Phone Frame */}
              <div style={{
                background: vars.color.vaultBlack,
                borderRadius: fluidUnit(32),
                padding: fluidUnit(12),
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}>
                {/* Phone Screen */}
                <div style={{
                  background: vars.color.vpGreen,
                  borderRadius: fluidUnit(24),
                  aspectRatio: "9/19.5",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {/* Notch */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: fluidUnit(24),
                    background: vars.color.vaultBlack,
                    borderBottomLeftRadius: fluidUnit(16),
                    borderBottomRightRadius: fluidUnit(16),
                    zIndex: 10,
                  }} />
                  
                  {/* KYC Screen Content */}
                  <div style={{
                    padding: `${fluidUnit(48)} ${fluidUnit(20)} ${fluidUnit(20)}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    {/* Header */}
                    <div>
                      <div style={{ marginBottom: fluidUnit(32), textAlign: "center" }}>
                        <Typography as="p" style={{ fontSize: fluidUnit(10), fontWeight: 600, marginBottom: fluidUnit(8) }}>
                          Step 1 of 3
                        </Typography>
                      </div>

                      {/* Shield Icon */}
                      <div style={{
                        width: fluidUnit(60),
                        height: fluidUnit(60),
                        margin: "0 auto",
                        marginBottom: fluidUnit(24),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" 
                            stroke={vars.color.vaultBlack} 
                            strokeWidth="2" 
                            fill="none"
                          />
                        </svg>
                      </div>

                      <Typography as="h2" style={{ 
                        fontSize: fluidUnit(18), 
                        fontWeight: 700, 
                        textAlign: "center",
                        marginBottom: fluidUnit(16),
                        color: vars.color.vaultBlack 
                      }}>
                        Verify Your Identity
                      </Typography>
                      
                      <Typography as="p" style={{ 
                        fontSize: fluidUnit(10), 
                        color: "#666",
                        textAlign: "center",
                        lineHeight: 1.4,
                        marginBottom: fluidUnit(24),
                        padding: `0 ${fluidUnit(8)}`,
                      }}>
                        To keep your account secure and comply with regulations, we need to verify your identity. This process is quick and secure.
                      </Typography>
                      
                      {/* Verification Steps */}
                      <div style={{ marginBottom: fluidUnit(24) }}>
                        {[
                          { icon: "📄", text: "Identification number from your government-issued ID" },
                          { icon: "🪪", text: "Government-issued ID (Passport, Driver's License, or National ID)" },
                          { icon: "📸", text: "Take a selfie for identity confirmation" }
                        ].map((step, idx) => (
                          <div key={idx} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: fluidUnit(8),
                            marginBottom: fluidUnit(12),
                            padding: `${fluidUnit(8)} 0`,
                          }}>
                            <span style={{ fontSize: fluidUnit(14) }}>{step.icon}</span>
                            <Typography as="span" style={{ fontSize: fluidUnit(9), fontWeight: 600, lineHeight: 1.3 }}>
                              {step.text}
                            </Typography>
                          </div>
                        ))}
                      </div>

                      {/* Time indicator */}
                      <div style={{ 
                        textAlign: "center",
                        padding: `${fluidUnit(8)} 0`,
                      }}>
                        <Typography as="p" style={{ 
                          fontSize: fluidUnit(8), 
                          color: "#999",
                          fontStyle: "italic"
                        }}>
                          ⏱️ This process takes about 3-4 minutes
                        </Typography>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div style={{ padding: `${fluidUnit(12)} 0` }}>
                      <div style={{
                        background: vars.color.vaultBlack,
                        color: vars.color.vaultWhite,
                        padding: fluidUnit(12),
                        borderRadius: fluidUnit(24),
                        textAlign: "center",
                      }}>
                        <Typography as="span" style={{ fontSize: fluidUnit(12), fontWeight: 700 }}>
                          Start Verification
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - KYC Form */}
          <div>
            <Typography as="h1" style={{ 
              fontSize: fluidUnit(48), 
              fontWeight: 700, 
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
              lineHeight: 1.2
            }}>
              Verify Your Identity
            </Typography>
            
            <Typography as="p" style={{ 
              fontSize: fluidUnit(18), 
              marginBottom: fluidUnit(24),
              color: "#333",
              lineHeight: 1.6
            }}>
              Complete the KYC verification process to unlock all features of your VaultPay account.
            </Typography>
            
            {/* Progress Indicator */}
            <div style={{ marginBottom: fluidUnit(32) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                {[1, 2, 3].map(step => (
                  <div key={step} style={{
                    flex: 1,
                    height: 4,
                    background: currentStep >= step ? vars.color.vaultBlack : 'rgba(0,0,0,0.2)',
                    marginRight: step < 3 ? fluidUnit(8) : 0,
                    borderRadius: 2,
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <Typography as="p" style={{ fontSize: fluidUnit(14), color: '#666' }}>
                Step {currentStep} of 3
              </Typography>
            </div>

            {/* Plaid Message for USA */}
            {isUSA && (
              <div style={{
                background: vars.color.neonMint,
                border: `3px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(24),
                marginBottom: fluidUnit(32),
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: fluidUnit(16) }}>
                  <div style={{
                    width: fluidUnit(48),
                    height: fluidUnit(48),
                    background: vars.color.vaultWhite,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${vars.color.vaultBlack}`,
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: fluidUnit(24) }}>🔒</span>
                  </div>
                  <div>
                    <Typography as="h3" style={{ 
                      fontSize: fluidUnit(20), 
                      fontWeight: 700, 
                      marginBottom: fluidUnit(8),
                      color: vars.color.vaultBlack 
                    }}>
                      Secure Verification with Plaid
                    </Typography>
                    <Typography as="p" style={{ 
                      fontSize: fluidUnit(15), 
                      color: vars.color.vaultBlack,
                      lineHeight: 1.6,
                      fontWeight: 600
                    }}>
                      <strong>For U.S. residents:</strong> Your KYC verification will be securely processed through Plaid, a trusted leader in financial data security. Plaid uses bank-level encryption and is trusted by over 8,000 financial institutions to protect your personal information.
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Non-USA Message */}
            {!isUSA && selectedCountry && (
              <div style={{
                background: 'rgba(255,255,255,0.6)',
                border: `2px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(20),
                marginBottom: fluidUnit(32),
              }}>
                <Typography as="p" style={{ 
                  fontSize: fluidUnit(14), 
                  color: vars.color.vaultBlack,
                  lineHeight: 1.6,
                }}>
                  ℹ️ Your identity verification will be processed securely through our international verification partner using industry-standard encryption and security protocols.
                </Typography>
              </div>
            )}

            {/* KYC Form Content */}
            <div style={{
              background: vars.color.vaultWhite,
              border: `3px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(24),
              padding: fluidUnit(32),
              marginBottom: fluidUnit(24),
            }}>
              {renderStepContent()}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: fluidUnit(16),
                background: "rgba(198, 40, 40, 0.1)",
                border: "2px solid #c62828",
                borderRadius: fluidUnit(12),
                marginBottom: fluidUnit(24),
              }}>
                <Typography as="p" style={{ color: "#c62828", fontSize: fluidUnit(14) }}>
                  {error}
                </Typography>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: fluidUnit(16) }}>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    flex: 1,
                    padding: fluidUnit(16),
                    background: vars.color.vaultWhite,
                    color: vars.color.vaultBlack,
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(16),
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  style={{
                    flex: 1,
                    padding: fluidUnit(16),
                    background: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(16),
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitKYC}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: fluidUnit(16),
                    background: vars.color.neonMint,
                    color: vars.color.vaultBlack,
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(16),
                    fontWeight: 600,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? 'Submitting...' : 'Submit KYC'}
                </button>
              )}
            </div>

            {/* Help Text */}
            <div style={{
              marginTop: fluidUnit(24),
              padding: fluidUnit(16),
              background: 'rgba(255,255,255,0.5)',
              borderRadius: fluidUnit(12),
            }}>
              <Typography as="p" style={{ fontSize: fluidUnit(12), color: "#666", lineHeight: 1.5 }}>
                💡 <strong>Why verify?</strong> Identity verification helps us keep your account secure and comply with financial regulations.
              </Typography>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
