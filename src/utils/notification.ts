import { VariantType, enqueueSnackbar } from "notistack";

// eslint-disable-next-line import/no-anonymous-default-export
export default (message: string, variant: VariantType) =>
	enqueueSnackbar(message, {
		variant,
		autoHideDuration: 5000,
		disableWindowBlurListener: true,
		anchorOrigin: { horizontal: "right", vertical: "top" },
	});
