# /apk — Descarga del APK

Carpeta de publicación del APK firmado de RivalFit para Android. El botón de
descarga del sitio apunta directamente a `rivalfit-latest.apk`.

## Archivos esperados

```text
public/apk/
├── rivalfit-latest.apk      # alias estable del último release
├── rivalfit-1.0.0.apk      # opcional: copia versionada
└── SHA256SUMS              # opcional: checksums para verificación manual
```

> Solo este `README.md` se versiona. El APK y `SHA256SUMS` están en
> `.gitignore` y se copian al despliegue.

## Comportamiento actual del sitio

- El CTA enlaza a `/apk/rivalfit-latest.apk` de forma directa.
- El sitio no comprueba la existencia del archivo ni muestra el hash en
  tiempo de ejecución.
- Si `rivalfit-latest.apk` no está en el despliegue, el enlace devuelve 404.

## Cómo publicar un release

```powershell
# 1. Copia el APK firmado
Copy-Item .\build\app\outputs\flutter-apk\app-release.apk .\public\apk\rivalfit-latest.apk

# 2. Opcional: conserva una copia versionada
Copy-Item .\public\apk\rivalfit-latest.apk .\public\apk\rivalfit-1.0.0.apk

# 3. Genera checksums
Get-FileHash .\public\apk\rivalfit-*.apk -Algorithm SHA256 |
  ForEach-Object { "$($_.Hash.ToLower())  $(Split-Path $_.Path -Leaf)" } |
  Set-Content .\public\apk\SHA256SUMS -Encoding ascii
```

Linux/CI (formato GNU):

```bash
cd public/apk
sha256sum rivalfit-*.apk > SHA256SUMS
```

## Validación

1. `npm run build` copia `public/` completo a `dist/`.
2. Verifica que `dist/apk/rivalfit-latest.apk` exista antes de desplegar.
3. El servidor debe entregar el archivo con
   `Content-Type: application/vnd.android.package-archive`.
4. Verificación manual del hash:

   ```powershell
   Get-FileHash .\public\apk\rivalfit-latest.apk -Algorithm SHA256
   ```

## Notas de seguridad

- **Nunca** versionar keystores (`*.jks`), `key.properties` ni credenciales.
- No incrustar datos de firma, claves o tokens en el HTML del sitio.
- Comparte el checksum por un canal confiable si lo usas para verificar la
  descarga.
