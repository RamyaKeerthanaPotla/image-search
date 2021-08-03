import axios from "axios";
import {
  ASTRA_DB_ID,
  ASTRA_DB_REGION,
  ASTRA_DB_KEYSPACE,
  ASTRA_DB_TABLE,
} from "./AstraDetails";

const BASE_URL = `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/${ASTRA_DB_TABLE}`,


const getImages = async (query) => {
    
};
