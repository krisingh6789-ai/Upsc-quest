# Build the APK (no installs on your phone/PC needed)
1. Create a free GitHub account, make a new repository (e.g. lbsnaa-quest).
2. Upload everything in this folder, including the hidden .github folder, then commit to the main branch.
   (Web upload: "Add file > Upload files". If .github is skipped, create the file
   .github/workflows/build-apk.yml by hand and paste in its contents.)
3. Open the Actions tab > "Build APK" > wait ~5 min for the green tick.
4. Open that run > Artifacts > download LBSNAA-Quest-APK (a zip containing app-debug.apk).
5. Send app-debug.apk to your phone, open it, allow "install unknown apps" when asked.
