import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY)

export default supabase;

export async function InsertOne(table, dt) {
  const { data, error } = await supabase.from(table).insert([dt]);
  return error ? null : data;
}

export async function FindOne(table, criteria) {
  const { data, error } = await supabase.from(table).select("*").match(criteria).limit(1)
  .single();
  return error ? null : (data);
}

export async function UpdateOne(table, criteria, dt) {
  const { data, error } = await supabase.from(table).update(dt).match(criteria)
  return error ? null : data;
}

export async function DeleteOne(table, criteria) {
  const { data, error } = await supabase.from(table).delete().match(criteria)
  return error ? null : data;
}