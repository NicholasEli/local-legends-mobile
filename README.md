### Todo

- Put back test assets on users
- Create and deploy new bundle

##### Immediate

- Implement New Standings Algorithm

##### Backlog

- Return VOD price tags
- Push Notifications (Subscribe to athlete, event, general) & - Athlete Follow
- Add Stripe

### Fixes things sometimes

# 1. Remove old build artifacts

cd ios
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData

# 2. Remove Pods and reinstall

rm -rf Pods
rm -rf Podfile.lock
pod install --repo-update

# 3. Go back to project root

cd ..

# 4. Run CLI again

npx react-native run-ios --simulator "iPhone 16 Pro" --verbose
