import { Category } from '../types';

interface CategorySelectProps {
  categories: Category[];
  value: number;
  onChange: (value: number) => void;
}

export default function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  // Получаем основные категории (без родителя)
  const mainCategories = categories.filter(cat => !cat.parent_id);

  // Группируем подкатегории по родительским категориям
  const categoryGroups = mainCategories.map(mainCat => ({
    main: mainCat,
    subs: categories.filter(cat => cat.parent_id === mainCat.id)
  }));

  return (
    <select
      value={value || ''}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full"
      required
    >
      <option value="">Выберите категорию</option>
      {categoryGroups.map(group => (
        <optgroup key={group.main.id} label={group.main.name}>
          {group.subs.map(subCat => (
            <option key={subCat.id} value={subCat.id}>
              {subCat.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}