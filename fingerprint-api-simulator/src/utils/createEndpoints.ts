import IOpts from "../interfaces/IOpts";

export default function createEndpoints(opts: IOpts): string[] {
    return opts.endpoints.flatMap(pt => pt.split(','));
}