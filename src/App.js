import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function convert() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
          );

          if (!res.ok) throw new Error("Something went wrong with the API");

          const data = await res.json();

          if (data.response === "False") throw new Error("Result Not Found");
          setResult(data.rates[toCur]);
        } catch (err) {
          if (err.name !== "AbortError") {
            // console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (fromCur === toCur) return setResult(amount);
      convert();
    },
    [amount, fromCur, toCur]
  );

  return (
    <>
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="currency-converter">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isLoading}
          />
          <select
            value={fromCur}
            onChange={(e) => setFromCur(e.target.value)}
            disabled={isLoading}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
          </select>
          <select
            value={toCur}
            onChange={(e) => setToCur(e.target.value)}
            disabled={isLoading}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
          </select>
          <p>
            {result} {toCur}
          </p>
        </div>
      )}
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}
