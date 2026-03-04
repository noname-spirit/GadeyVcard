import { useState, useEffect } from 'react';

export interface DeviceInfo {
    // Device type
    type: 'iPhone' | 'Android' | 'iPad' | 'Desktop' | 'Unknown';
    model: string; // e.g., 'iPhone 15 Pro', 'Samsung Galaxy S24'
    isIOS: boolean;
    isAndroid: boolean;
    isTablet: boolean;
    isMobile: boolean;

    // Screen info
    viewportWidth: number;
    viewportHeight: number;
    screenHeight: number;
    screenWidth: number;
    devicePixelRatio: number;
    orientation: 'portrait' | 'landscape';

    // Size categories  
    screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // xs: <350, sm: 350-400, md: 400-480, lg: 480-640, xl: >640
    hasNotch: boolean;

    // Spatial info
    safeAreaTop: number;
    safeAreaBottom: number;
}

export function useDeviceDetection(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        type: 'Unknown',
        model: 'Unknown',
        isIOS: false,
        isAndroid: false,
        isTablet: false,
        isMobile: false,
        viewportWidth: 0,
        viewportHeight: 0,
        screenHeight: 0,
        screenWidth: 0,
        devicePixelRatio: 1,
        orientation: 'portrait',
        screenSize: 'sm',
        hasNotch: false,
        safeAreaTop: 0,
        safeAreaBottom: 0,
    });

    useEffect(() => {
        const detectDevice = () => {
            const ua = navigator.userAgent;

            // iOS/Android detection
            const isIOS = /iPad|iPhone|iPod/.test(ua) && !/(UNIX|Windows)/.test(ua);
            const isAndroid = /Android/.test(ua);

            // Device type detection
            let type: 'iPhone' | 'Android' | 'iPad' | 'Desktop' | 'Unknown' = 'Unknown';
            let model = 'Unknown';

            if (isIOS) {
                if (/iPad/.test(ua)) {
                    type = 'iPad';
                    model = 'iPad';
                } else {
                    type = 'iPhone';
                    // Detect iPhone model
                    if (/iPhone 15 Pro Max/.test(ua)) model = 'iPhone 15 Pro Max';
                    else if (/iPhone 15 Pro/.test(ua)) model = 'iPhone 15 Pro';
                    else if (/iPhone 15/.test(ua)) model = 'iPhone 15';
                    else if (/iPhone 14 Pro Max/.test(ua)) model = 'iPhone 14 Pro Max';
                    else if (/iPhone 14 Pro/.test(ua)) model = 'iPhone 14 Pro';
                    else if (/iPhone 14/.test(ua)) model = 'iPhone 14';
                    else if (/iPhone 13 Pro Max/.test(ua)) model = 'iPhone 13 Pro Max';
                    else if (/iPhone 13 Pro/.test(ua)) model = 'iPhone 13 Pro';
                    else if (/iPhone 13/.test(ua)) model = 'iPhone 13';
                    else if (/iPhone SE/.test(ua)) model = 'iPhone SE';
                    else model = 'iPhone';
                }
            } else if (isAndroid) {
                type = 'Android';
                // Detect Android model
                if (/Samsung/.test(ua)) {
                    if (/Galaxy S24 Ultra/.test(ua)) model = 'Samsung Galaxy S24 Ultra';
                    else if (/Galaxy S24/.test(ua)) model = 'Samsung Galaxy S24';
                    else if (/Galaxy S23 Ultra/.test(ua)) model = 'Samsung Galaxy S23 Ultra';
                    else if (/Galaxy S23/.test(ua)) model = 'Samsung Galaxy S23';
                    else if (/Galaxy A/.test(ua)) model = 'Samsung Galaxy A Series';
                    else model = 'Samsung Device';
                } else if (/Google Pixel/.test(ua)) {
                    model = 'Google Pixel';
                } else model = 'Android Device';
            } else {
                type = 'Desktop';
                model = 'Desktop Browser';
            }

            // Screen dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const devicePixelRatio = window.devicePixelRatio || 1;

            // Orientation
            const orientation =
                (viewportWidth > viewportHeight ? 'landscape' : 'portrait') as 'portrait' | 'landscape';

            // Determine if mobile/tablet/desktop
            const isMobile = viewportWidth < 768;
            const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

            // Screen size category
            let screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
            if (viewportWidth < 350) screenSize = 'xs';
            else if (viewportWidth < 400) screenSize = 'sm';
            else if (viewportWidth < 480) screenSize = 'md';
            else if (viewportWidth < 640) screenSize = 'lg';
            else screenSize = 'xl';

            // Notch detection (iOS specific)
            const hasNotch =
                isIOS &&
                (screenHeight / screenWidth > 2.0 || // Notch devices have higher aspect ratio
                    viewportWidth < screenWidth); // Safe area is smaller than screen

            // Safe area padding (for notch devices)
            const safeAreaTop = hasNotch ? Math.max(20, Math.round(screenHeight * 0.05)) : 0;
            const safeAreaBottom = hasNotch ? Math.max(20, Math.round(screenHeight * 0.03)) : 0;

            setDeviceInfo({
                type,
                model,
                isIOS,
                isAndroid,
                isTablet,
                isMobile,
                viewportWidth,
                viewportHeight,
                screenHeight,
                screenWidth,
                devicePixelRatio,
                orientation,
                screenSize,
                hasNotch,
                safeAreaTop,
                safeAreaBottom,
            });
        };

        detectDevice();

        // Re-detect on resize and orientation change
        window.addEventListener('resize', detectDevice);
        window.addEventListener('orientationchange', detectDevice);

        return () => {
            window.removeEventListener('resize', detectDevice);
            window.removeEventListener('orientationchange', detectDevice);
        };
    }, []);

    return deviceInfo;
}

// Helper function to get Tailwind classes based on screen size
export function getDeviceClasses(screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl', type: 'container' | 'header' | 'gap' | 'padding' | 'photoSize' | 'titleSize' | 'formContainer' | 'formTitle' | 'inputSize'): string {
    const classMap: Record<typeof type, Record<typeof screenSize, string>> = {
        container: {
            xs: 'px-2 py-0.5',
            sm: 'px-2.5 py-0.75',
            md: 'px-3 py-1',
            lg: 'px-4 py-2',
            xl: 'px-6 py-2',
        },
        header: {
            xs: 'mb-0.5 gap-0.5',
            sm: 'mb-1 gap-0.5',
            md: 'mb-2 gap-1',
            lg: 'mb-3 gap-1',
            xl: 'mb-3 gap-1',
        },
        gap: {
            xs: 'gap-1',
            sm: 'gap-1.5',
            md: 'gap-2.5',
            lg: 'gap-3.5',
            xl: 'gap-5',
        },
        padding: {
            xs: 'px-2 py-0.5',
            sm: 'px-2.5 py-1',
            md: 'px-3 py-1',
            lg: 'px-4 py-2',
            xl: 'px-6 py-2',
        },
        photoSize: {
            xs: 'w-16 h-16',
            sm: 'w-20 h-20',
            md: 'w-24 h-24',
            lg: 'w-28 h-28',
            xl: 'w-32 h-32',
        },
        titleSize: {
            xs: 'text-base',
            sm: 'text-lg',
            md: 'text-xl',
            lg: 'text-2xl',
            xl: 'text-4xl',
        },
        formContainer: {
            xs: 'px-2 py-1',
            sm: 'px-3 py-1.5',
            md: 'px-4 py-2',
            lg: 'px-5 py-3',
            xl: 'px-6 py-5',
        },
        formTitle: {
            xs: 'text-xs mb-0.5',
            sm: 'text-sm mb-1',
            md: 'text-base mb-1.5',
            lg: 'text-lg mb-2',
            xl: 'text-lg mb-2',
        },
        inputSize: {
            xs: 'px-3 py-0.5 text-xs',
            sm: 'px-4 py-1 text-sm',
            md: 'px-5 py-1 text-sm',
            lg: 'px-5 py-2 text-base',
            xl: 'px-5 py-2 text-base',
        },
    };

    return classMap[type]?.[screenSize] || '';
}

// Helper function to get image size in pixels
export function getImageSize(screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): number {
    const sizeMap: Record<typeof screenSize, number> = {
        xs: 64,
        sm: 80,
        md: 96,
        lg: 112,
        xl: 128,
    };
    return sizeMap[screenSize] || 128;
}
