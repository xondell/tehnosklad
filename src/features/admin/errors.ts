export class AdminDataError extends Error {
  constructor(
    public readonly code: string,
    message = "Admin operation failed",
  ) {
    super(message);
    this.name = "AdminDataError";
  }
}

const knownMessages: Array<[string, string]> = [
  ["admin_required", "Требуется активная роль администратора."],
  ["category_in_use", "Категория используется товарами или подкатегориями."],
  ["category_parent_cycle", "Категория не может быть собственным потомком."],
  ["attribute_group_in_use", "Группа содержит характеристики."],
  ["attribute_in_use", "Характеристика уже используется."],
  ["attribute_option_in_use", "Вариант уже используется в товарах."],
  [
    "category_attribute_in_use",
    "Характеристика заполнена у товаров этой категории.",
  ],
  [
    "product_category_attributes_incompatible",
    "Сначала очистите несовместимые характеристики товара.",
  ],
  [
    "Published category requires",
    "Для публикации категории нужны полные переводы RU и RO.",
  ],
  [
    "Published product requires ru and ro",
    "Для публикации товара нужны полные переводы RU и RO.",
  ],
  [
    "Published product requires a published category",
    "Сначала опубликуйте выбранную категорию.",
  ],
  [
    "missing a required attribute",
    "Заполните все обязательные характеристики.",
  ],
  [
    "images require ru and ro alt",
    "У каждого изображения должны быть alt-тексты RU и RO.",
  ],
  [
    "incomplete attribute metadata",
    "Проверьте переводы и активность характеристик и вариантов.",
  ],
  ["Cannot change the type", "Тип используемой характеристики менять нельзя."],
  [
    "canonical filters",
    "Текстовая характеристика не может быть каноническим фильтром.",
  ],
  ["duplicate key", "Такой slug, код или SKU уже используется."],
  ["site_setting_not_allowed", "Эту настройку редактировать нельзя."],
];

export function sanitizeAdminError(error: unknown): AdminDataError {
  if (error instanceof AdminDataError) return error;
  const raw =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message)
      : "";
  for (const [needle, message] of knownMessages) {
    if (raw.includes(needle)) return new AdminDataError(needle, message);
  }
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "unexpected";
  if (code === "23505")
    return new AdminDataError("duplicate", "Такое значение уже используется.");
  if (code === "23503")
    return new AdminDataError(
      "in_use",
      "Сущность используется и не может быть удалена.",
    );
  return new AdminDataError(
    "operation_failed",
    "Операция не выполнена. Проверьте данные и повторите попытку.",
  );
}

export function adminErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  const decoded = decodeURIComponent(code);
  return (
    knownMessages.find(([needle]) => decoded === needle)?.[1] ??
    (decoded === "validation"
      ? "Проверьте обязательные поля и формат значений."
      : decoded === "upload_invalid"
        ? "Файл должен быть JPEG, PNG, WebP или AVIF размером до 5 МБ."
        : decoded === "operation_failed"
          ? "Операция не выполнена. Проверьте данные и повторите попытку."
          : "Операция не выполнена.")
  );
}
