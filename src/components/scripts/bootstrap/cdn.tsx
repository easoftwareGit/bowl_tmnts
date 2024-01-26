import Script from "next/script";

export default function BootstrapCDN() {
  return (
    <div className="container">
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        onLoad={() =>
          console.log(`script loaded correctly, bootstrap cdn`)
        }
      />
    </div>
  )
}