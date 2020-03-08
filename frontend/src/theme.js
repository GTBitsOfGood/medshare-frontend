export const theme = {
  fg: 'palevioletred',
  bg: 'white'
};

const breakpoints = {
  mobileS: '320px',
  mobileL: '420px',
  laptop: '1024px'
};

export const deviceSize = {
  mobileS: `(max-width: ${breakpoints.mobileS})`,
  mobileL: `(max-width: ${breakpoints.mobileL})`,
  laptop: `(max-width: ${breakpoints.laptop})`
};
