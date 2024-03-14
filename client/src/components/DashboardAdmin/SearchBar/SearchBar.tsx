import styles from "./SearchBar.module.css";

interface ISearchBarProps {
  inputValue: string;
  onChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({
  inputValue,
  onChangeHandler,
}) => {
  return (
    <div className={styles.search_container}>
      <input value={inputValue} onChange={onChangeHandler} type="text" />
      <button>
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
};

export default SearchBar;
