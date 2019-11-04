package xyz.janficko.apphub.ui.base

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.LayoutRes
import androidx.fragment.app.Fragment


abstract class BaseFragment : Fragment() {

    protected var TAG = ""

    protected var baseActivity: BaseActivity? = null

    @get: LayoutRes
    protected abstract val layoutResId: Int

    override fun onAttach(context: Context) {
        super.onAttach(context)
        TAG = javaClass.simpleName
        baseActivity = context as BaseActivity?
        baseActivity?.hideKeyboard()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(layoutResId, container, false)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        // No call for super(). Bug on API Level > 11.
        // Exception: Can not perform this action after onSaveInstanceState
    }

}