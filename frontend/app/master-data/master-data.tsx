import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import MasterDataPage from "./ui/MasterDataPage";
import { getMasterEntity } from "./masterDataConfig";

export default function MasterDataRoute() {
    const { entity: slug } = useParams<{ entity: string }>();
    const navigate = useNavigate();
    const entity = slug ? getMasterEntity(slug) : undefined;

    useEffect(() => {
        if (slug && !entity) {
            navigate("/dashboard", { replace: true });
        }
    }, [slug, entity, navigate]);

    if (!entity) return null;

    return <MasterDataPage entity={entity} />;
}