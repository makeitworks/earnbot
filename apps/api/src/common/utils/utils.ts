

export function sleepAWhile(millSecond: number): Promise<void> {
    return new Promise( resolve => setTimeout( resolve, millSecond));
}