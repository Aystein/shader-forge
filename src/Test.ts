interface Parent<A, B> {
    first: A;
    second: B;
}

function returnTypeOfA<A, B, Type>() {
    const k: A = null;

    return k;
}