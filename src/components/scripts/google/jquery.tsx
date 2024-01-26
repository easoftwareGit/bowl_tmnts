import Script from "next/script";

export default function GoogleJQuery() {
  return (
    <div className="container">
      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        onLoad={() =>
          console.log(`script loaded correctly, google APIs jQuery`)
        }
      />
    </div>
  )
}