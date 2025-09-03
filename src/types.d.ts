declare module "react-router-dom" {
  export const useNavigate: any;
  export const Link: any;
  export const BrowserRouter: any;
}

declare module "hammerjs" {
  const Hammer: any;
  export default Hammer;
}

declare module "next/image" {
  const Image: any;
  export default Image;
}

declare module "react-joyride" {
  const Joyride: any;
  export default Joyride;
  export type CallBackProps = any;
  export const STATUS: any;
  export type Step = any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare var SpeechRecognition: any;
type SpeechRecognition = any;
interface SpeechRecognitionEvent extends Event {
  results: any;
}
