package com.olipaysdkexamplereactnativeapp.olipaysdk.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ReactUtils {

    public static WritableMap toWritableMap(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        WritableMap writableMap = Arguments.createMap();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (entry.getValue() instanceof Map) {
                writableMap.putMap(entry.getKey(), toWritableMap((Map) entry.getValue()));
            } else if (entry.getValue() instanceof Collection) {
                writableMap.putArray(entry.getKey(), toWritableArray((Collection) entry.getValue()));
            } else if (entry.getValue() instanceof String) {
                writableMap.putString(entry.getKey(), (String) entry.getValue());
            } else if (entry.getValue() instanceof Boolean) {
                writableMap.putBoolean(entry.getKey(), (Boolean) entry.getValue());
            } else if (entry.getValue() instanceof Double) {
                writableMap.putDouble(entry.getKey(), (Double) entry.getValue());
            } else if (entry.getValue() instanceof Integer) {
                writableMap.putInt(entry.getKey(), (Integer) entry.getValue());
            } else if (entry.getValue() == null) {
                writableMap.putNull(entry.getKey());
            }
        }
        return writableMap;
    }

    public static WritableMap toWritableStringMap(Map<String, String> map) {
        WritableMap writableMap = Arguments.createMap();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            writableMap.putString(entry.getKey(), (String) entry.getValue());
        }
        return writableMap;
    }

    public static WritableArray toWritableArray(Collection collection) {
        WritableArray array = Arguments.createArray();
        for (Object item : collection) {
            if (item instanceof Map) {
                array.pushMap(toWritableMap((Map) item));
            } else if (item instanceof Collection) {
                array.pushArray(toWritableArray((Collection) item));
            } else if (item instanceof String) {
                array.pushString((String) item);
            } else if (item instanceof Boolean) {
                array.pushBoolean((Boolean) item);
            } else if (item instanceof Double) {
                array.pushDouble((Double) item);
            } else if (item instanceof Integer) {
                array.pushInt((Integer) item);
            } else if (item == null) {
                array.pushNull();
            }
        }
        return array;
    }

    public static Object toHashMap(ReadableMap map) {
        HashMap<String, Object> hashMap = new HashMap<>();
        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (map.getType(key)) {
                case Null:
                    hashMap.put(key, null);
                    break;
                case Boolean:
                    hashMap.put(key, map.getBoolean(key));
                    break;
                case Number:
                    hashMap.put(key, map.getDouble(key));
                    break;
                case String:
                    hashMap.put(key, map.getString(key));
                    break;
                case Map:
                    hashMap.put(key, toHashMap(map.getMap(key)));
                    break;
                case Array:
                    hashMap.put(key, toArrayList(map.getArray(key)));
                    break;
                default:
                    throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
            }
        }
        return hashMap;
    }

    private static ArrayList<Object> toArrayList(ReadableArray array) {
        ArrayList<Object> arrayList = new ArrayList<>(array.size());
        for (int i = 0, size = array.size(); i < size; i++) {
            switch (array.getType(i)) {
                case Null:
                    arrayList.add(null);
                    break;
                case Boolean:
                    arrayList.add(array.getBoolean(i));
                    break;
                case Number:
                    arrayList.add(array.getDouble(i));
                    break;
                case String:
                    arrayList.add(array.getString(i));
                    break;
                case Map:
                    arrayList.add(toHashMap(array.getMap(i)));
                    break;
                case Array:
                    arrayList.add(toArrayList(array.getArray(i)));
                    break;
                default:
                    throw new IllegalArgumentException("Could not convert Object at index: " + i + " when calling ReactUtils.toArrayList");
            }
        }
        return arrayList;
    }
}
