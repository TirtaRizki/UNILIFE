
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getBrandingSettings } from '@/lib/data-services';
import type { BrandingSettings } from '@/lib/types';
import { revalidateTag } from 'next/cache';

// GET /api/branding
export async function GET() {
    try {
        const settings = await getBrandingSettings();
        return NextResponse.json(settings || {});
    } catch (error) {
        console.error("Error fetching branding settings:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ message: 'Error fetching branding settings', error: errorMessage }, { status: 500 });
    }
}

// POST /api/branding
export async function POST(request: Request) {
    try {
        const settings: BrandingSettings = await request.json();
        
        if (!settings.logoUrl) {
            return NextResponse.json({ message: 'Logo URL is required' }, { status: 400 });
        }

        // Use the reliable adminDb instance from the singleton
        await adminDb().collection('branding').doc('singleton').set(settings, { merge: true });
        
        revalidateTag('branding_settings_tag');
        
        console.log('✅ Branding settings saved successfully.');
        return NextResponse.json({ message: 'Branding settings saved successfully' }, { status: 200 });
    } catch (error) {
        console.error("❌ Error saving branding settings:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during saving.";
        return NextResponse.json({ message: 'Error saving branding settings', error: errorMessage }, { status: 500 });
    }
}
