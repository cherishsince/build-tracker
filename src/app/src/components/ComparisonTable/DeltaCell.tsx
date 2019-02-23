import { DeltaCell as Cell } from '@build-tracker/comparator';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

interface Color {
  red: number;
  green: number;
  blue: number;
}

const green: Color = {
  red: 6,
  green: 176,
  blue: 41
};

const red: Color = {
  red: 249,
  green: 84,
  blue: 84
};

const scale = ({ red, blue, green }: Color, percentDelta: number): string =>
  `rgba(${red},${green},${blue},${Math.max(Math.min(Math.abs(percentDelta), 1), 0)})`;

const DeltaCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const sizeDelta = cell.sizes[sizeKey];
  const percentDelta = cell.percents[sizeKey];

  const backgroundColor =
    percentDelta > 0
      ? scale(red, percentDelta)
      : sizeDelta === 0
      ? cell.hashChanged
        ? scale(red, 1)
        : 'white'
      : scale(green, percentDelta);

  const stringChange = `${sizeDelta} bytes (${(percentDelta * 100).toFixed(3)}%)`;
  const title = cell.hashChanged && sizeDelta === 0 ? `Unexpected hash change! ${stringChange}` : stringChange;

  return (
    <Td style={[style, { backgroundColor }]} title={title}>
      <Text>{sizeDelta === 0 ? (cell.hashChanged ? '⚠️' : '') : formatBytes(sizeDelta)}</Text>
    </Td>
  );
};

export default DeltaCell;
