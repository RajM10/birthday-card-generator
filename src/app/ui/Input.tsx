interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  multiline?: boolean;
  description?: string;
}

export default function Input({
  label,
  multiline = false,
  description,
  className = "",
  ...props
}: InputProps) {
  const inputClassName =
    "w-full p-3 rounded-xl bg-white/10 border-2 border-transparent text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300";
  const finalClassName = `${inputClassName} ${className}`;

  return (
    <div>
      <label className="block text-white mb-2 font-medium">{label}</label>
      {multiline ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${finalClassName} min-h-[120px] resize-none`}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={finalClassName}
        />
      )}
      {description && (
        <p className="text-white/60 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}
