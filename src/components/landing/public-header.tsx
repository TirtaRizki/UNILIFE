
"use client";

import React from 'react';
import PublicHeaderClient from './public-header-client';

const PublicHeader = () => {
    // Hardcode the logo URL to the dummy logo
    const logoUrl = '/images/unilife_logo.png';

    return <PublicHeaderClient logoUrl={logoUrl} />;
};

export default PublicHeader;
