interface RegistrationNotificationProps {
    completionPercentage: number;
    currentStep: number;
    onDismiss: () => void;
}
export default function SellerRegistrationNotification({ completionPercentage, currentStep, onDismiss }: RegistrationNotificationProps): import("react").JSX.Element;
export {};
