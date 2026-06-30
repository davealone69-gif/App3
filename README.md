# Building Your Android APK

This application has been configured with **Capacitor** to allow you to easily compile it into an Android `.apk` or `.aab` file. 

Because the AI Studio preview environment is a cloud sandbox and does not have the 10GB+ Android SDK and Android Studio tools installed, you will need to build the final APK on your own machine.

Here's how to do it:

### Step 1: Export Content
1. In the top-right corner of Google AI Studio Build, click the **Settings / Export** menu.
2. Select **Export to ZIP** or **Push to GitHub** to get the source code on your local computer.

### Step 2: Install Local Requirements
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en) (v18+)
- [Android Studio](https://developer.android.com/studio) (Includes Android SDK)

### Step 3: Command Line Setup
Unzip the project, open your terminal to the project root, and run:
```bash
# Install all web and native dependencies
npm install

# Build the production web assets 
npm run build

# Sync the dist folder with the android project
npx cap sync android
```

### Step 4: Open and Build in Android Studio
Now, open the native Android project in Android Studio:
```bash
npx cap open android
```

1. Wait for Gradle to finish syncing the project.
2. Go to the top menu in Android Studio: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
3. Once finished, click "**locate**" in the bottom-right notification to find your `.apk` file!

*Need a quick local test? Just plug in an Android phone and hit the Green Play button in Android Studio.*
