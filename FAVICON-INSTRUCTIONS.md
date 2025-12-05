# Instructions: Add Your VaultPay Favicon

## ✅ Step 1: Prepare Your Image

You have already provided the green VaultPay V logo PNG image. Now you need to:

1. Save that image to your computer
2. Rename it to exactly: **`icon.png`**

## 📁 Step 2: Place the Image

Copy your `icon.png` file to this exact location:

```
c:\Users\Acer\Desktop\vaultpay-website\app\icon.png
```

**Full path structure:**
```
vaultpay-website/
  └── app/
      └── icon.png  ← Place your image here
```

## 🔧 Step 3: Restart Development Server

After placing the image:

1. Stop the dev server (press `Ctrl + C` in terminal)
2. Delete the build cache:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
3. Restart the server:
   ```powershell
   npm run dev
   ```

## 🌐 Step 4: Clear Browser Cache

To see the new favicon immediately:

**Windows (Chrome/Edge/Brave):**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- **OR** Hard refresh: `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + Delete`
- Select cache
- Clear
- **OR** Hard refresh: `Cmd + Shift + R`

## ✨ Alternative: Quick Method

If you want me to see the image and convert it properly, you can also:

1. Place your PNG in the `public/` folder (e.g., `public/vaultpay-logo.png`)
2. Let me know, and I can create an `icon.tsx` that references it

---

## 🔍 Verify It's Working

1. Open `http://localhost:3000`
2. Check the browser tab - you should see your green V logo
3. If it's still showing the old one, hard refresh (`Ctrl + F5`)

---

## 📝 Note

I've removed the `icon.tsx` file that was generating the favicon dynamically. Next.js will now automatically use `app/icon.png` when you place it there.

**File Requirements:**
- Name: `icon.png` (exactly)
- Location: `app/` folder
- Format: PNG
- Recommended size: 32x32 or larger (Next.js will optimize it)
