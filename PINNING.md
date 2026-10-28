# Certificate pinning plan

Expo managed apps cannot pin certificates in JavaScript. For production builds (EAS):

1. `npx expo install react-native-ssl-public-key-pinning`
2. Add the pins for every allow-listed host (see `lib/secureFetch.ts`) and call
   `initializeSslPinning({ 'cdn.jsdelivr.net': { includeSubdomains: true, publicKeyHashes: ['<primary>', '<backup>'] } })`
   before the first request in `App.tsx`.
3. Always ship at least one backup pin.

Other hardening already configured in `app.json`:
- Hermes bytecode (default)
- Android R8/ProGuard minification + resource shrinking (`expo-build-properties`)
