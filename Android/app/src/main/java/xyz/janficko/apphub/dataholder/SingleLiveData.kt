package xyz.janficko.apphub.dataholder

import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Observer
import xyz.janficko.apphub.util.printWarning
import java.util.concurrent.atomic.AtomicBoolean

class SingleLiveData<T> : MutableLiveData<T>() {

    private val TAG = SingleLiveData::class.java.simpleName

    private val pending : AtomicBoolean = AtomicBoolean(false)

    fun observedData(lifecycleOwner : LifecycleOwner, observer : Observer<T>) {
        if (hasActiveObservers()) {
            printWarning(TAG, "Multiple observers but only one will be notified of changes.")

            super.observe(lifecycleOwner, Observer<T> {
                if (pending.compareAndSet(true, false)) {
                    observer.onChanged(it)
                }
            })
        }
    }

    fun addValue(t : T) {
        pending.set(true)
        super.setValue(t)
    }

}
