// Rewards Tab Component - Matches Mobile App Referral Design
import React from 'react';

interface RewardsTabProps {
  referralStats: any;
  referralLevels: any[];
  referralLoading: boolean;
  onCopyCode: () => void;
  onShareCode: () => void;
}

export const renderRewardsTab = (props: RewardsTabProps) => {
  const { referralStats, referralLevels, referralLoading, onCopyCode, onShareCode } = props;

  const currentShares = referralStats?.total_referrals || 0;
  const referralCode = referralStats?.referral_code || 'N/A';
  const currentLevel = referralStats?.current_level || 1;
  const awaitingKyc = referralStats?.awaiting_kyc || 0;
  const claimableRewards = referralStats?.claimable_level_rewards || [];

  const isLevelCompleted = (level: number): boolean => {
    const levelData = referralLevels[level - 1];
    if (!levelData) return false;
    return currentShares >= levelData.shares_required;
  };

  const getLevelProgress = (level: number): number => {
    const levelData = referralLevels[level - 1];
    if (!levelData || levelData.shares_required <= 0) return 0;
    const progress = (currentShares / levelData.shares_required) * 100;
    return Math.min(progress, 100);
  };

  if (referralLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "#666" }}>
        Loading referral data...
      </div>
    );
  }

  return (
    <div>
      {/* Claimable Rewards Alert */}
      {claimableRewards.length > 0 && (
        <div style={{ background: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)", borderRadius: 12, padding: 16, marginBottom: 24, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#000", fontSize: 16, fontWeight: 600 }}>🎉 {claimableRewards.length} Reward{claimableRewards.length > 1 ? 's' : ''} Available!</div>
              <div style={{ color: "#000", fontSize: 13, opacity: 0.8 }}>👆 Tap here to claim your reward{claimableRewards.length > 1 ? 's' : ''} now!</div>
            </div>
            <div style={{ color: "#000", fontSize: 20 }}>→</div>
          </div>
        </div>
      )}

      {/* Awaiting KYC Info */}
      {awaitingKyc > 0 && (
        <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ color: "#888", fontSize: 13 }}>{awaitingKyc} referral{awaitingKyc > 1 ? 's' : ''} pending KYC verification</span>
        </div>
      )}

      {/* Hero Card */}
      <div style={{ background: "linear-gradient(135deg, #06FF89 0%, #B8FF9F 100%)", borderRadius: 16, padding: 40, textAlign: "center", marginBottom: 24 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
        <h2 style={{ color: "#000", fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Refer & Win!</h2>
        <p style={{ color: "#000", fontSize: 16, margin: 0, opacity: 0.8 }}>Share and unlock rewards</p>
      </div>

      {/* Referral Code Card */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 24 }}>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>Your Referral Code</div>
        <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: 2 }}>{referralCode}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCopyCode} style={{ flex: 1, background: "#1a1a1a", color: "#fff", border: "1px solid #333", padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Code
          </button>
          <button onClick={onShareCode} style={{ flex: 1, background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
        </div>
      </div>

      {/* Referral Levels */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Referral Levels</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFD700", padding: "4px 12px", borderRadius: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ color: "#000", fontSize: 13, fontWeight: 600 }}>Level {currentLevel}</span>
          </div>
        </div>

        <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>Your KYC-Verified Shares:</div>
          <div style={{ color: "#06FF89", fontSize: 24, fontWeight: 700 }}>{currentShares}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {referralLevels.slice(0, 6).map((level, index) => {
            const levelNum = index + 1;
            const isCompleted = isLevelCompleted(levelNum);
            const progress = getLevelProgress(levelNum);
            const isGold = levelNum === 6;

            return (
              <div key={levelNum} style={{ background: isGold ? "linear-gradient(135deg, #FFD700 20%, #FFA500 100%)" : "#1a1a1a", borderRadius: 12, padding: 16, border: isCompleted ? "2px solid #06FF89" : "1px solid #333", opacity: !isCompleted && levelNum > 1 && !isLevelCompleted(levelNum - 1) ? 0.5 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isGold ? "#000" : "#FFD700"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span style={{ color: isGold ? "#000" : "#fff", fontSize: 16, fontWeight: 600 }}>{isGold ? "Gold Reward" : `Level ${levelNum}`}</span>
                  </div>
                  {isCompleted && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
                <div style={{ color: isGold ? "#000" : "#888", fontSize: 13, marginBottom: 4 }}>Share {level.shares_required} times</div>
                <div style={{ color: isGold ? "#000" : "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🎁 {level.reward_description}</div>
                {!isCompleted && (
                  <div>
                    <div style={{ background: isGold ? "rgba(0,0,0,0.2)" : "#0a0a0a", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ background: "#06FF89", height: "100%", width: `${progress}%`, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ color: isGold ? "#000" : "#666", fontSize: 12 }}>{currentShares}/{level.shares_required} shares</div>
                  </div>
                )}
                {isCompleted && <div style={{ color: "#00FF00", fontSize: 13, fontWeight: 600 }}>✓ Completed</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>How It Works</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Share Your Code</div>
            <div style={{ color: "#666", fontSize: 12 }}>Send your unique code to friends</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>They Sign Up</div>
            <div style={{ color: "#666", fontSize: 12 }}>Friend creates account with your code</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>You Both Earn</div>
            <div style={{ color: "#666", fontSize: 12 }}>Get rewarded after first transaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};
