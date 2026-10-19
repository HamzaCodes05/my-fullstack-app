// Minimal chat formatting: **bold**, and numbered items ("1. ", "2. ") each on their own line.
export default function FormattedText({ text }: { text: string }) {
  const spaced = text.replace(/(\S)\s+(?=\d+\.\s)/g, "$1\n");
  return (
    <>
      {spaced.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
