import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List
} from "react-virtualized";

import { FlatList, View, StyleSheet, Keyboard, TouchableOpacity, Text } from 'react-native';

export default class WebScrollView extends Component {
  constructor(props) {
    super(props)

    this.cache = React.createRef()

    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 200
    })

  }

  renderItem = (item, index) => {
    const { renderItem } = this.props;
    const msgId = this.props.mentionedMsgId
    return renderItem({ item, index, msgId });
  }

  render() {
    const { ListHeaderComponent, ListFooterComponent, data, inverted } = this.props;
    let messages = data;
    if (!inverted) {
      messages = data.slice().reverse();
    }
    return (
      <div
        style={styles.container}
      >
        {ListHeaderComponent()}

        <div style={{ width: "100%", height: "100vh" }} className="test-class1">
          <AutoSizer>
            {({ width, height }) => {
              return (
                <div
                  style={{ height: '100%' }}
                >
                  <List
                    ref={this.props.forwardRef}
                    width={width}
                    height={height}
                    rowHeight={this.cache.rowHeight}
                    deferredMeasurementCache={this.cache}
                    rowCount={messages.length}
                    scrollToIndex={this.props.finalInd? this.props.finalInd: messages.length}
                    rowRenderer={({ key, index, style, parent }) => {
                      return (
                        <CellMeasurer
                          key={key}
                          cache={this.cache}
                          parent={parent}
                          columnIndex={0}
                          rowIndex={index}
                        >
                          <div style={style} >
                            {this.renderItem(messages[messages.length - (index + 1)], messages.length - (index + 1), height)}
                          </div>
                        </CellMeasurer>
                      );
                    }}
                  />
                </div>
              );
            }}
          </AutoSizer>
        </div>

        {/* {messages.map(this.renderItem)} */}
        {ListFooterComponent()}
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    minHeight: '100%',
    width: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    alignItems: 'stretch',
  },
};

WebScrollView.defaultProps = {
  data: [],
  extraData: {},
  ListHeaderComponent: () => { },
  ListFooterComponent: () => { },
  inverted: false,
};

WebScrollView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  extraData: PropTypes.object,
  inverted: PropTypes.bool,
  renderFooter: PropTypes.func,
  keyExtractor: PropTypes.func,
  enableEmptySections: PropTypes.bool,
  automaticallyAdjustContentInsets: PropTypes.bool,
  contentContainerStyle: PropTypes.object,
  renderItem: PropTypes.func,
  ListHeaderComponent: PropTypes.func,
  ListFooterComponent: PropTypes.func,
};
