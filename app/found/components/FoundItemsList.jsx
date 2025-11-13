<div
  key={item.id}
  className="bg-white rounded-lg shadow-md flex flex-col justify-between h-full p-4"
>
  <div>
    <img
      src={item.image}
      alt={item.title}
      className="rounded-t-lg object-cover w-full h-48"
    />
    <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
    <p className="text-gray-600 text-sm">{item.description}</p>
    <p className="text-sm mt-1">📍 {item.location}</p>
  </div>
  <button className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
    Claim Item
  </button>
</div>
