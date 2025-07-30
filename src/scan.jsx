import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function Scan() {
    const navigate = useNavigate();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250,
        });

        scanner.render(
            (decodedText) => {
                console.log("QR Code scanned:", decodedText);

                try {
                    const url = new URL(decodedText);
                    const startNode = url.searchParams.get("start");
                    const pathName = url.pathname; // e.g., "/floor"

                    if (startNode && pathName) {
                        // Navigate with the query string
                        navigate(`/destination?start=${startNode}`);
                    } else {
                        console.warn("Invalid QR data");
                    }
                } catch (e) {
                    console.error("Invalid URL in QR code", e);
                }
            },
            (err) => {
                console.warn("Scan error", err);
            }
        );

        return () => scanner.clear();
    }, [navigate]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Scan QR Code to find your position</h2>
            <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
        </div>
    );
}
