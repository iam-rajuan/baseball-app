import LogoSvg from '../../assets/svg/marietta-baseball-academy-logo.svg';

type LogoMarkProps = {
  width?: number;
  height?: number;
};

export function LogoMark({ width = 88, height = 88 }: LogoMarkProps) {
  return <LogoSvg height={height} width={width} />;
}
