// AdminConfig.jsx e Endereco.jsx. Centralizado aqui para evitar divergência.

/**
 * Campo de formulário padronizado para o painel admin.
 *
 * @param {string} label - Texto do label
 * @param {string} name - name do input (usado no handleChange)
 * @param {string} value - Valor controlado
 * @param {Function} onChange - Handler de mudança
 * @param {string} [placeholder] - Placeholder do input
 * @param {string} [hint] - Texto de ajuda abaixo do campo
 * @param {"text"|"email"|"url"|"tel"|"number"|"time"|"date"} [type="text"]
 * @param {boolean} [required]
 */
export default function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
