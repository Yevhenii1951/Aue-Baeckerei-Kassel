-- PII redaction for audit payloads. Recursive: drops PII keys at every depth
-- and walks arrays. Audit writers must call it before inserting before_data/after_data.

CREATE FUNCTION redact_audit_json(p_value jsonb) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p_value IS NULL THEN RETURN NULL; END IF;
  IF jsonb_typeof(p_value) = 'object' THEN
    RETURN COALESCE((SELECT jsonb_object_agg(key, redact_audit_json(value)) FROM jsonb_each(p_value)
      WHERE lower(key) NOT IN ('name', 'email', 'phone', 'message', 'token', 'secret', 'password', 'address', 'street', 'house_number', 'postal_code', 'city', 'delivery_note')), '{}'::jsonb);
  END IF;
  IF jsonb_typeof(p_value) = 'array' THEN RETURN COALESCE((SELECT jsonb_agg(redact_audit_json(value)) FROM jsonb_array_elements(p_value)), '[]'::jsonb); END IF;
  RETURN p_value;
END;
$$;
