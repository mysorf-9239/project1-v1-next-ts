import BigNumber from "bignumber.js";

BigNumber.config({
    FORMAT: {
        groupSize: 3,
        groupSeparator: '.',
        decimalSeparator: ','
    },
});

export default function formatNumber(number: number): string {
    const bigNumber = new BigNumber(number);
    return bigNumber.toFormat();
}
