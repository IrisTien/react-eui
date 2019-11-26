import * as zoid from 'zoid/dist/zoid.frameworks';

let EuiZoidComponent = zoid.create({
  tag: 'eui-session-component',
  url: 'http://localhost:3000/app/session?embed=true',
  dimensions: {
    width: '100%',
    height: '500px'
  },
  props: {
    hydraToken: {
      type: 'string',
      required: false
    }
  }
});

export default EuiZoidComponent;
