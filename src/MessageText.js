/* eslint no-use-before-define: ["error", { "variables": false }] */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import ParsedText from './ParsedText';

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {

  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentMessage.text !== nextProps.currentMessage.text;
  }

  onUrlPress(url) {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          // eslint-disable-next-line
          console.error('No handler for URL:', url);
        } else {
          window.open(url, '_blank');
        }
      });
    }
  }

  onPhonePress(phone) {
    const options = ['Call', 'Text', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    // this.context.actionSheet().showActionSheetWithOptions({
    //   options,
    //   cancelButtonIndex,
    // },
    // (buttonIndex) => {
    //   // switch (buttonIndex) {
    //   //   case 0:
    //   //     Communications.phonecall(phone, true);
    //   //     break;
    //   //   case 1:
    //   //     Communications.text(phone);
    //   //     break;
    //   // }
    // });
  }

  onEmailPress(email) {
    // Communications.email(email, null, null, null, null);
  }

  renderBoldText = (matchingString, matches) => matches[1]
  

  renderText = (matchingString, matches) => {
    const { members, profile } = this.props; 
    let name = matches[4]
    if (profile && profile.username == name) {
      name = profile.name
    }
    else {
      let user = members.find(user=> user.id==matches[4]);
      if(user){
        name=user.display;
      }
      else if(matches[3]){
        name = matches[3]
      }
    }
    return `${matches[2]}${name}`;
  }

  render() {
    const linkStyle = StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]);
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <ParsedText
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
            this.props.customTextStyle,
          ]}
          parse={[
            ...this.props.parsePatterns(linkStyle),

            { type: 'mention', style: linkStyle, onPress: null, renderText: this.renderText },
            { type: 'url', style: linkStyle, onPress: this.onUrlPress },
            { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
            { type: 'email', style: linkStyle, onPress: this.onEmailPress },
            { type: 'bold', style: { fontWeight: 'bold' }, onPress: null, renderText: this.renderBoldText },
          ]}
          childrenProps={{ ...this.props.textProps }}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }

}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func,
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  customTextStyle: {},
  textProps: {},
  parsePatterns: () => [],
};

MessageText.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object,
  customTextStyle: Text.propTypes.style,
};
