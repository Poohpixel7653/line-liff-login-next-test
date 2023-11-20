import { useState, useEffect } from 'react';

interface Tambon {
    id: number;
    zip_code: number;
    name_th: string;
    name_en: string;
    amphure_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface Amphure {
    id: number;
    name_th: string;
    name_en: string;
    province_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    tambon: Tambon[];
}

interface Province {
    id: number;
    name_th: string;
    name_en: string;
    geography_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    amphure: Amphure[];
}

export interface SelectData {
    provinces: Province[];
}


const useSelectAddress = () => {
    const [dataAddress, setDataAddress] = useState<SelectData | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedAmphure, setSelectedAmphure] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json");
                const jsonData = await response.json();
                setDataAddress({ provinces: jsonData.sort((a:Province, b:Province) => a.name_th.localeCompare(b.name_th)) });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleProvinceChange = (province_th: string) => {
        console.log("CHECK PROVINCE ID : ", province_th);
        setSelectedProvince(province_th);
        setSelectedAmphure(null);
    };

    const handleAmphureChange = (amphure_th: string) => {
        console.log("CHECK DISTRICT ID : ", amphure_th);

        setSelectedAmphure(amphure_th);
    };

    const selectedProvinceData = dataAddress?.provinces.find(
        (province) => province.name_th === selectedProvince
    );
    if(selectedProvinceData){
        selectedProvinceData.amphure.sort((a:Amphure, b:Amphure) => a.name_th.localeCompare(b.name_th));
    }

    const selectedAmphureData = selectedProvinceData?.amphure.find(
        (amphure) => amphure.name_th === selectedAmphure
    );
    if(selectedAmphureData){
        selectedAmphureData.tambon.sort((a:Tambon, b:Tambon) => a.name_th.localeCompare(b.name_th));
    }

    return {
        dataAddress,
        selectedProvince,
        selectedAmphure,
        handleProvinceChange,
        handleAmphureChange,
        selectedProvinceData,
        selectedAmphureData,
    };
};

export default useSelectAddress;