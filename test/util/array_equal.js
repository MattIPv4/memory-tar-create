import { AssertionError } from 'assert';

const fail = (a, b) => {
    throw new AssertionError({
        actual: a,
        expected: b,
        operator: 'arrayEqual',
    });
};

export default (a, b) => {
    if (a.length !== b.length) return fail(a, b);

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return fail(a, b);
    }
};
