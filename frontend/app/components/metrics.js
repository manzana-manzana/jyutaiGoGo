import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 402//375;
const guidelineBaseHeight = 874//812;

const Metrics ={
    horizontalScale : (sizePer) => (width / guidelineBaseWidth) * (guidelineBaseWidth * sizePer * 0.01),
    verticalScale : (sizePer) => (height / guidelineBaseHeight) * (guidelineBaseHeight * sizePer * 0.01),
    moderateScale: (size, factor = 0.3) =>
        size + ((width / guidelineBaseWidth) * size - size) * factor
}
export default Metrics
//{ horizontalScale, verticalScale, moderateScale };
// const verticalScale = (sizePer) => (height / guidelineBaseHeight) * size;
// size + (horizontalScale(size) - size) * factor;
