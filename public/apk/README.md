# /apk — Contrato de descarga (Fase B)

Contiene el APK **oficial firmado** y su checksum. El sitio activa la
sección de descarga automáticamente cuando estos archivos existen.

## Archivos esperados

```
public/apk/
├── rivalfit-latest.apk      # alias estable (apunta al último release)
├── rivalfit-1.0.0.apk      # versión versionada (release firmado)
└── SHA256SUMS              # checksums:  <hash>  <nombre_archivo>
```

## Cómo publicar un release

> Coordina con Fase A (keystore release + `flutter build apk --release`).

```powershell
# 1. Copia el APK firmado
Copy-Item .\build\app\outputs\flutter-apk\app-release.apk "public\apk\rivalfit-1.0.0.apk"
Copy-Item "public\apk\rivalfit-1.0.0.apk" "public\apk\rivalfit-latest.apk"

# 2. Regenera los checksums
Get-FileHash "public\apk\rivalfit-*.apk" -Algorithm SHA256 |
  ForEach-Object { "$( $_.Hash.ToLower() )  $( Split-Path $_.Path -Leaf )" } |
  Set-Content "public\apk\SHA256SUMS" -Encoding ascii
```

Linux/CI (formato estándar GNU):
```bash
cd public/apk
sha256sum rivalfit-latest.apk rivalfit-1.0.0.apk > SHA256SUMS
```

## Validación

1. `npm run build` (se copia todo `public/` a `dist/`).
2. El sitio hace `HEAD /apk/rivalfit-latest.apk` y lee `SHA256SUMS` para
   mostrar el hash y habilitar el botón de descarga.
3. En el gateway: `curl -H "Host: rivalfit.iscx.site" http://api-gw:8000/apk/rivalfit-latest.apk`
   debe responder `Content-Type: application/vnd.android.package-archive`.

## Notas de seguridad

- **Nunca** versionar keystore (`*.jks`) ni `key.properties`.
- El hash en pantalla mitiga la desconfianza de “orígenes desconocidos”.
- No incrustar nada de firma/release en el HTML del sitio.