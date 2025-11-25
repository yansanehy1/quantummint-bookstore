import React from "react";
type State = {
    hasError: boolean;
};
export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
    state: State;
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    componentDidCatch(error: any, info: any): void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | React.JSX.Element;
}
export {};
