import { Dimensions, StyleSheet, PixelRatio } from "react-native";

const { width } = Dimensions.get('screen');

const scale = width / 375;

export const normalizeSize = (size: number) => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const colors = {
    darkGray: '#2D2D2D',
    gray: '#D2D2D2',
    lightGray: '#EEEEEE',
    main: '#790E28',
    orange: '#d35400',

    textPrimary: '#131313',
    textSecondary: '#666666',
    textError: '#d62323',
    placeHolderText: '#d1d1d1',
    background: '#fff'
}

export const globalStyles = StyleSheet.create({
    title: {
        fontSize: normalizeSize(28),
        fontWeight: 'bold',
        color: colors.darkGray,
        marginBottom: 20,
    },

    subtitle: {
        fontSize: normalizeSize(16),
        fontWeight: 'normal',
        color: colors.darkGray,
    },

    errorTitle: {
        fontSize: normalizeSize(14),
        fontWeight: '300',
        color: colors.textError,
        marginBottom: 10,
    },

    errorText: {
        fontSize: normalizeSize(12),
        fontWeight: '300',
        color: colors.textError,
    },

    button: {
        alignItems: 'center',
        backgroundColor: colors.main,
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(20),
        width: '100%',
        borderRadius: 4,
    },

    smallButton: {
        alignItems: 'center',
        backgroundColor: colors.main,
        paddingHorizontal: normalizeSize(12),
        paddingVertical: normalizeSize(8),
        width: '100%',
        borderRadius: 4
    },

    outlineButton: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: colors.main,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(12),
        width: '100%',
    },

    disabledButton: {
        backgroundColor: colors.gray,
    },

    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: normalizeSize(20),
    },

    smallButtonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: normalizeSize(12)
    },

    input: {
        height: 30,
        width: '100%',
        borderWidth: 1,
        paddingHorizontal: normalizeSize(12),
        paddingVertical: normalizeSize(8),
        borderRadius: 4,
        borderColor: colors.gray,
        backgroundColor: '#fff',
        color: colors.textPrimary,
        fontSize: normalizeSize(18),
    },

    fabButton: {
        position: 'absolute',
        margin: normalizeSize(16),
        right: 10,
        bottom: 10,
        backgroundColor: colors.main,
        borderRadius: 50,
    },

    fabButton2: {
        position: 'absolute',
        margin: normalizeSize(16),
        right: 10,
        bottom: 80,
        backgroundColor: colors.main,
        borderRadius: 50,
    },

    fabButtonSecondary: {
        position: 'absolute',
        margin: normalizeSize(16),
        right: normalizeSize(8),
        bottom: normalizeSize(60),
        backgroundColor: "#fff",
        borderRadius: 50,
    },

    inputLabel: {
        fontSize: normalizeSize(14),
        fontWeight: 'bold',
        marginVertical: 5,
        marginLeft: 5,
        color: colors.textPrimary,
    },

    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    buttonIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },

    picker: {
        backgroundColor: 'white',
        color: colors.textPrimary,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.gray,
    }
})