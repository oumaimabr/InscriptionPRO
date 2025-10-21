const Btn=({classbtn,onClick,disabled,name,loading})=>{
    return(
        <>
        <button
        className={classbtn}
        onClick={onClick}
        disabled={disabled}
        >
            {name}
        </button>
        </>
    )
}
export default Btn