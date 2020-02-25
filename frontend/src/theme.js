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
  mobileS: `(min-width: ${breakpoints.mobileS})`,
  mobileL: `(min-width: ${breakpoints.mobileL}`,
  laptop: `(min-width: ${breakpoints.laptop})`
};
