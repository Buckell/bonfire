export default interface UniverseProvider {
    getUniverse(universeNumber: number): Buffer;
}
