import PageHeader from "@/components/page-header";
import { ProfileForm } from "./profile-form";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
    return (
        <>
            <PageHeader title="Profile Admin" />
            <Card className="content-card">
                <CardContent className="p-6">
                    <ProfileForm />
                </CardContent>
            </Card>
        </>
    );
}
