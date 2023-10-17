import { MongoClient, ServerApiVersion, Db, GridFSBucket } from "mongodb";
export class My_Mongo {
    private connection_string: string = `mongodb+srv://HokoriAkiko:RitaRossweisse6!@crimepracticecluster.l1jpdl0.mongodb.net/?retryWrites=true&w=majority`;
    private client: MongoClient = new MongoClient(this.connection_string, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    public collection_names: any = { words_array: 'words_array', operational: 'operational' };
    public db: Db = this.client.db('CRIME_DATA'); // gonna use CRIME_DATA DB as main one in my cluster
    public bucket = new GridFSBucket(this.db, { bucketName: 'raw_file_bucket' });

    async mongo_connect() {
        console.log('\nConnecting to mongodb...\n');
        try {
            await this.client.connect();
            console.log('Connected to mongodb successfully...')
        }
        catch (err) {
            console.log('\nError occured while connecting to mongodb...\n', err);
            throw err;
        }
    }
}