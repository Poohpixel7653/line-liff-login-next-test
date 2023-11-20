import { useEffect, useState } from "react";

const useLIFF = () => {
    const [liffObject, setLiffObject] = useState<any | null>(null);
    const [liffError, setLiffError] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);

    useEffect(() => {
        const initializeLIFF = async () => {
            try {
                const liff = (await import("@line/liff")).default;
                console.log("LIFF init...");
                await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
                console.log("LIFF init succeeded.");

                if (!liff.isLoggedIn()) {
                    console.log("NOT LOGIN");
                    liff.login({
                        redirectUri: "https://line-aquater.adcm.co.th/",
                    });
                } else {
                    const data = await liff.getProfile();
                    setProfile(data);
                    console.log("PROFILE", data);
                    console.log("LOGINED");
                    console.log("ID TOKEN ", liff.getIDToken());
                    console.log("DECODED ", liff.getDecodedIDToken());
                    // router.push("/meterlist/" + profile.userId);
                }

                setLiffObject(liff);
            } catch (error: any) {
                console.log("LIFF init failed.");
                setLiffError(error.toString());
            }
        };

        initializeLIFF();
    }, []);

    return { liffObject, liffError, profile };
};

export default useLIFF;