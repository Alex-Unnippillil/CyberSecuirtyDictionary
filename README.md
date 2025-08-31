# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/

![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security

This project sets a strict Content Security Policy to limit where resources can load from.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
```

The policy is applied via a `<meta http-equiv="Content-Security-Policy">` tag in `index.html`. When deploying, you may set the same value as an HTTP response header.
